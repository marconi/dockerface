package dockerface

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ant0ine/go-json-rest/rest"
	"github.com/jmcvetta/napping"
)

type ContainerEndpoint struct{}

func (ce *ContainerEndpoint) Filter(w rest.ResponseWriter, req *rest.Request) {
	params := napping.Params{"all": req.URL.Query().Get("all")}

	var result []*Container
	resp, err := napping.Get(buildUrl("containers/json"), &params, &result, nil)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if resp.Status() != http.StatusOK {
		rest.Error(w, fmt.Sprintf("Invalid status code: %v", resp.Status()), http.StatusBadRequest)
		return
	}
	w.WriteJson(result)
}

func (ce *ContainerEndpoint) Start(w rest.ResponseWriter, req *rest.Request) {
	cid := req.PathParam("id")
	resp, err := napping.Post(buildUrl("containers/"+cid+"/start"), nil, nil, nil)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// if start was successful, retrieve container and return its current state
	if resp.Status() == http.StatusNoContent {
		time.Sleep(1000 * time.Millisecond) // give it time

		var result []*Container
		resp, err := napping.Get(buildUrl("containers/json"), nil, &result, nil)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if resp.Status() == http.StatusOK {
			if c := filterContainer(result, cid); c != nil {
				w.WriteJson(c)
			}
		}
	} else {
		w.WriteHeader(resp.Status())
	}
}

func (ce *ContainerEndpoint) Stop(w rest.ResponseWriter, req *rest.Request) {
	cid := req.PathParam("id")
	resp, err := napping.Post(buildUrl("containers/"+cid+"/stop"), nil, nil, nil)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// if stop was successful, retrieve container and return its current state
	if resp.Status() == http.StatusNoContent {
		time.Sleep(1000 * time.Millisecond) // give it time

		params := napping.Params{"all": "true"}
		var result []*Container
		resp, err := napping.Get(buildUrl("containers/json"), &params, &result, nil)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if resp.Status() == http.StatusOK {
			if c := filterContainer(result, cid); c != nil {
				w.WriteJson(c)
			}
		}
	} else {
		w.WriteHeader(resp.Status())
	}
}

func filterContainer(containers []*Container, cid string) *Container {
	for _, c := range containers {
		if c.Id == cid {
			return c
		}
	}
	return nil
}

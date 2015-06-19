package dockerface

import (
	"fmt"
	"net/http"

	"github.com/ant0ine/go-json-rest/rest"
	"github.com/jmcvetta/napping"
)

type stateContainer struct {
	State struct {
		Paused     bool   `json:"paused"`
		Restarting bool   `json:"restarting"`
		Running    bool   `json:"running"`
		FinishedAt string `json:"finishedat"`
		StartedAt  string `json:"startedat"`
		ExitCode   int    `json:"exitcode"`
	} `json:"state"`
}

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
		container, err := getContainerState(cid)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteJson(container)
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
		container, err := getContainerState(cid)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteJson(container)
		}
	} else {
		w.WriteHeader(resp.Status())
	}
}

func getContainerState(cid string) (*stateContainer, error) {
	var container *stateContainer
	_, err := napping.Get(buildUrl("containers/"+cid+"/json"), nil, &container, nil)
	if err != nil {
		return nil, fmt.Errorf("Error getting container state: %v", err)
	}
	return container, nil
}

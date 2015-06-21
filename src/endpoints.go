package dockerface

import (
	"fmt"
	"net/http"

	log "code.google.com/p/log4go"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/fsouza/go-dockerclient"
)

const CONTAINER_STOP_TIMEOUT = 10 // seconds

var (
	daemonPort   int    = 2375
	daemonHost   string = fmt.Sprintf("http://127.0.0.1:%d", daemonPort)
	dockerClient *docker.Client
)

func init() {
	daemonHost = fmt.Sprintf("http://%s:%d", getDaemonHostIp(), daemonPort)
	log.Info("Docker daemon host: %s", daemonHost)

	client, err := docker.NewClient(daemonHost)
	if err != nil {
		log.Crash("Error initializing docker client: %v", err)
	}
	dockerClient = client
}

type ContainerEndpoint struct{}

func (ce *ContainerEndpoint) Filter(w rest.ResponseWriter, req *rest.Request) {
	containers, err := dockerClient.ListContainers(docker.ListContainersOptions{
		All: req.URL.Query().Get("all") == "true",
	})
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(containers)
}

func (ce *ContainerEndpoint) Start(w rest.ResponseWriter, req *rest.Request) {
	cid := req.PathParam("id")
	if err := dockerClient.StartContainer(cid, nil); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	container, err := dockerClient.InspectContainer(cid)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(container.State)
}

func (ce *ContainerEndpoint) Stop(w rest.ResponseWriter, req *rest.Request) {
	cid := req.PathParam("id")
	if err := dockerClient.StopContainer(cid, CONTAINER_STOP_TIMEOUT); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	container, err := dockerClient.InspectContainer(cid)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(container.State)
}

func (ce *ContainerEndpoint) Inspect(w rest.ResponseWriter, req *rest.Request) {
	cid := req.PathParam("id")
	container, err := dockerClient.InspectContainer(cid)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(container)
}

package dockerface

import (
	"fmt"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/fsouza/go-dockerclient"
)

const CONTAINER_STOP_TIMEOUT = 10 // seconds

var (
	daemonPort    int = 2375
	daemonTLSPort int = 2376
	dockerClient  *docker.Client
)

func init() {
	var (
		daemonHost string
		client     *docker.Client
		err        error
	)

	// See https://docs.docker.com/reference/commandline/cli/
	tlsVerify := GetEnv("DOCKER_TLS_VERIFY", "")
	if tlsVerify == "" {
		daemonHost = fmt.Sprintf("tcp://%s:%d", getDaemonHostIp(), daemonPort)
		client, err = docker.NewClient(daemonHost)
	} else {
		certPath := GetEnv("DOCKER_CERT_PATH", "")
		if certPath == "" {
			log.Fatal("Using TLS verify but DOCKER_CERT_PATH is empty")
		}

		log.Infof("Docker cert path: %s", certPath)
		ca := GetEnv("TLS_CA", fmt.Sprintf("%s/ca.pem", certPath))
		cert := GetEnv("TLS_CERT", fmt.Sprintf("%s/cert.pem", certPath))
		key := GetEnv("TLS_KEY", fmt.Sprintf("%s/key.pem", certPath))

		daemonHost = fmt.Sprintf("tcp://%s:%d", getDaemonHostIp(), daemonTLSPort)
		client, err = docker.NewTLSClient(daemonHost, cert, key, ca)
	}

	log.Infof("Docker daemon host: %s", daemonHost)
	if err != nil {
		log.Fatalf("Error initializing docker client: %v", err)
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

package main

import (
	"html/template"
	"io/ioutil"
	"net/http"

	log "code.google.com/p/log4go"
	"github.com/ant0ine/go-json-rest/rest"

	dockerface "github.com/marconi/dockerface/src"
)

const LISTEN_HOST = "0.0.0.0:8080"

func home(w http.ResponseWriter, r *http.Request) {
	fail := func(err error) {
		log.Crash("Error reading home template: %v", err)
	}

	homeTpl, err := ioutil.ReadFile("./templates/home.tpl")
	if err != nil {
		fail(err)
	}

	tmpl := template.New("home")
	home, err := tmpl.Parse(string(homeTpl))
	if err != nil {
		fail(err)
	}
	home.Execute(w, nil)
}

func main() {
	// init endpoints
	ce := new(dockerface.ContainerEndpoint)

	// init API server
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)

	router, err := rest.MakeRouter(
		rest.Get("/containers", ce.Filter),
		rest.Post("/containers/:id/start", ce.Start),
		rest.Post("/containers/:id/stop", ce.Stop),
		rest.Get("/containers/:id", ce.Inspect),
	)
	if err != nil {
		log.Crash("Error making router: %v", err)
	}
	api.SetApp(router)

	// mount handlers
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static"))))
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.HandleFunc("/", home)

	log.Info("Listening on %s", LISTEN_HOST)
	log.Crash(http.ListenAndServe(LISTEN_HOST, nil))
}

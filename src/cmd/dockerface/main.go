package main

import (
	"flag"
	"html/template"
	"io/ioutil"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/ant0ine/go-json-rest/rest"

	dockerface "github.com/marconi/dockerface/src"
)

const LISTEN_HOST = "0.0.0.0:8080"

func home(w http.ResponseWriter, r *http.Request) {
	fail := func(err error) {
		log.Fatalf("Error reading home template: %v", err)
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
	lvl := flag.String("log-level", "info", "Set logging level")
	flag.Parse()
	setLogLevel(*lvl)

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
		log.Fatalf("Error making router: %v", err)
	}
	api.SetApp(router)

	// mount handlers
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static"))))
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.HandleFunc("/", home)

	log.Infof("Listening on %s", LISTEN_HOST)
	log.Fatal(http.ListenAndServe(LISTEN_HOST, nil))
}

func setLogLevel(lvl string) {
	logLvl, err := log.ParseLevel(lvl)
	if err != nil {
		logLvl = log.InfoLevel
		log.Warnf("Invalid logging level '%s', defaulting to '%s'", lvl, logLvl.String())
	}
	log.SetLevel(logLvl)
}

package main

import (
	"html/template"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/ant0ine/go-json-rest/rest"
	"github.com/marconi/dockerface"
)

const LISTEN_HOST = "127.0.0.1:8080"

func home(w http.ResponseWriter, r *http.Request) {
	homeTpl, err := ioutil.ReadFile("./templates/home.tpl")
	if err != nil {
		log.Fatalln("Error reading home template:", err)
	}

	tmpl := template.New("home")
	home, err := tmpl.Parse(string(homeTpl))
	if err != nil {
		log.Fatalln("Error rendering home template:", err)
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
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)

	// mount handlers
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static"))))
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.HandleFunc("/", home)

	log.Println("Listening on", LISTEN_HOST)
	log.Fatalln(http.ListenAndServe(LISTEN_HOST, nil))
}

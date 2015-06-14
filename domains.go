package dockerface

type Container struct {
	Id      string                   `json:"id"`
	Image   string                   `json:"image"`
	Command string                   `json:"command"`
	Labels  map[string]string        `json:"labels"`
	Names   []string                 `json:"names"`
	Ports   []map[string]interface{} `json:"ports"`
	Status  string                   `json:"status"`
	Created int64                    `json:"created"`
}

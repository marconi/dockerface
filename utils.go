package dockerface

const API_BASE_URL = "http://127.0.0.1:2375"

func buildUrl(uri string) string {
	return API_BASE_URL + "/" + uri
}

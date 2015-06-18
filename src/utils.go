package dockerface

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

var (
	hostIp  string = "127.0.0.1"
	apiPort int    = 2375
)

func init() {
	// try check DOCKER_IP envar first
	value := os.Getenv("DOCKER_IP")
	if value != "" {
		hostIp = strings.TrimSpace(value)
	} else {
		// if that didn't work, get ip of host where this container is running
		phonecmd := exec.Command("bash", "-c", "ip route | awk '/default/ { print $3 }'")

		var outBuff bytes.Buffer
		phonecmd.Stdout = &outBuff
		if err := phonecmd.Start(); err != nil {
			log.Fatalln(err)
		}
		if err := phonecmd.Wait(); err != nil {
			log.Fatalln(err)
		}

		hostIp = strings.TrimSpace(string(outBuff.Bytes()))
	}

	log.Println("Got host ip:", hostIp)
}

func buildUrl(uri string) string {
	return fmt.Sprintf("http://%s:%d/%s", hostIp, apiPort, uri)
}

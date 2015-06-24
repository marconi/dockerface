package dockerface

import (
	"bytes"
	"os"
	"os/exec"
	"strings"

	log "github.com/Sirupsen/logrus"
)

func getDaemonHostIp() string {
	var hostIp string

	// try check DOCKER_IP envar first
	value := os.Getenv("DOCKER_IP")
	if value != "" {
		hostIp = strings.TrimSpace(value)
	} else {
		fail := func(err error) {
			log.Fatalf("Error retrieving host ip: %v", err)
		}

		// if that didn't work, get ip of host where this container is running
		phonecmd := exec.Command("bash", "-c", "ip route | awk '/default/ { print $3 }'")

		var outBuff bytes.Buffer
		phonecmd.Stdout = &outBuff
		if err := phonecmd.Start(); err != nil {
			fail(err)
		}
		if err := phonecmd.Wait(); err != nil {
			fail(err)
		}
		hostIp = strings.TrimSpace(string(outBuff.Bytes()))
	}

	return hostIp
}

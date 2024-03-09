package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool) // Connected clients
var broadcast = make(chan Message)           // Broadcast channel

// Message struct
type Message struct {
	Text string `json:"text"`
}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	// Start listening for incoming chat messages
	go handleMessages()

	// Start the server
	fmt.Println("WebSocket server is running on port 5500...")
	log.Fatal(http.ListenAndServe(":5500", nil))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		return
	}
	defer conn.Close()

	for {
		// Read message from client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Failed to read message from client:", err)
			break
		}

		// Print message received from client
		fmt.Printf("Received message: %s\n", msg)

		// Echo message back to client
		err = conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Println("Failed to write message to client:", err)
			break
		}
	}
}

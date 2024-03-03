package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool) // Connected clients
var broadcast = make(chan []byte)            // Broadcast channel

// Configure the WebSocket upgrader
var upgrader = websocket.Upgrader{}

func handleMessages() {
	for {
		// Receive message from broadcast channel
		msg := <-broadcast
		// Send message to all clients
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Printf("Error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	// Register new client
	clients[conn] = true

	// Infinite loop to read messages from WebSocket connection
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error: %v", err)
			delete(clients, conn)
			break
		}
		// Send received message to broadcast channel
		broadcast <- msg
	}
}

func main() {
	// Configure websocket route
	http.HandleFunc("/ws", wsEndpoint)

	// Serve frontend files
	http.Handle("/", http.FileServer(http.Dir("./ChatApp")))

	// Start listening for incoming chat messages
	go handleMessages()

	// Start the server on localhost port 1990
	log.Fatal(http.ListenAndServe(":1990", nil))
}

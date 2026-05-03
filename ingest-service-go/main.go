package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
)

type PolicyResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	reader, err := r.MultipartReader()
	if err != nil {
		http.Error(w, "Error creating reader", http.StatusInternalServerError)
		return
	}

	for {
		part, err := reader.NextPart()
		if err == io.EOF {
			break
		}
		if part.FileName() == "" {
			continue 
		}

		filename := part.FileName()

	
		log.Printf("Checking policy for file: %s...", filename)
		
		policyURL := fmt.Sprintf("http://localhost:9090/api/v1/policy/check?filename=%s", url.QueryEscape(filename))
		
		resp, err := http.Get(policyURL)
		if err != nil {
			log.Printf("Policy Engine offline: %v", err)
			http.Error(w, "Security Policy Engine is currently unavailable. Upload aborted.", http.StatusServiceUnavailable)
			return
		}
		defer resp.Body.Close()

		var policyResult PolicyResponse
		if err := json.NewDecoder(resp.Body).Decode(&policyResult); err != nil {
			log.Printf("Failed to read policy response: %v", err)
			http.Error(w, "Internal Security Error", http.StatusInternalServerError)
			return
		}

		if policyResult.Status != "APPROVED" {
			log.Printf("BLOCKED: Java rejected '%s'. Reason: %s", filename, policyResult.Message)
			http.Error(w, fmt.Sprintf("Upload Denied: %s", policyResult.Message), http.StatusForbidden)
			return
		}

		log.Printf("APPROVED: Java cleared '%s'. Vaulting now...", filename)
		
		dstPath := filepath.Join(".", "uploads", filename)
		_ = os.MkdirAll("uploads", os.ModePerm)

		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, "Error creating file on disk", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		log.Printf("Streaming file: %s...", filename)
		_, err = io.Copy(dst, part)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}
	}

	w.Write([]byte("File successfully cleared by Java and streamed to the vault!"))
}

func main() {
	http.HandleFunc("/upload", uploadHandler)

	log.Println("Ingest Service started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
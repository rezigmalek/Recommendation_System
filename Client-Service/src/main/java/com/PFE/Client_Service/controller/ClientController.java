package com.PFE.Client_Service.controller;

import com.PFE.Client_Service.entity.Client;
import com.PFE.Client_Service.response.ApiResponse;
import com.PFE.Client_Service.repository.ClientRepository;
import com.PFE.Client_Service.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientRepository clientRepository;

    public ClientController(ClientService clientService, ClientRepository clientRepository) {
        this.clientService = clientService;
        this.clientRepository = clientRepository;
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<ApiResponse<List<Client>>> getAllClients() {

        List<Client> clients = clientService.getAllClients();

        return ResponseEntity.ok(
                new ApiResponse<>("Clients retrieved successfully", true, clients));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> getClientById(@PathVariable int id) {

        Client client = clientService.getClientById(id);

        if (client != null) {
            return ResponseEntity.ok(
                    new ApiResponse<>("Client found", true, client));
        }

        return ResponseEntity.status(404).body(
                new ApiResponse<>("Client not found", false, null));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponse<Client>> createClient(@RequestBody Client client) {

        boolean updated = clientRepository.findByClientReference(client.getClientReference()).isPresent();

        Client result = clientService.createOrUpdateClient(client);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        updated ? "Client updated successfully" : "Client created successfully",
                        true,
                        result));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> updateClient(@PathVariable int id,
            @RequestBody Client client) {

        Client updated = clientService.updateClient(id, client);

        if (updated != null) {
            return ResponseEntity.ok(
                    new ApiResponse<>("Client updated successfully", true, updated));
        }

        return ResponseEntity.status(404).body(
                new ApiResponse<>("Client not found", false, null));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteClient(@PathVariable int id) {

        Client existing = clientService.getClientById(id);

        if (existing != null) {
            clientService.deleteClient(id);

            return ResponseEntity.ok(
                    new ApiResponse<>("Client deleted successfully", true, null));
        }

        return ResponseEntity.status(404).body(
                new ApiResponse<>("Client not found", false, null));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Client>>> uploadExcel(
            @RequestParam("file") MultipartFile file) {

        List<Client> savedClients = clientService.importFromExcel(file);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Excel imported successfully",
                        true,
                        savedClients));
    }
}
package com.PFE.Client_Service.service;

import com.PFE.Client_Service.entity.Client;
import com.PFE.Client_Service.repository.ClientRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // GET ALL
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // GET BY ID
    public Client getClientById(int id) {
        return clientRepository.findById(id).orElse(null);
    }

    // CREATE
    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    // UPDATE
    public Client updateClient(int id, Client clientDetails) {
        Client client = clientRepository.findById(id).orElse(null);

        if (client != null) {
            client.setFull_name(clientDetails.getFull_name());
            client.setFlag_activity(clientDetails.getFlag_activity());
            client.setTenure(clientDetails.getTenure());
            client.setAvg_traf_out_voice_onnet(clientDetails.getAvg_traf_out_voice_onnet());
            client.setAvg_traf_out_voice_offnet(clientDetails.getAvg_traf_out_voice_offnet());
            client.setAvg_traf_out_voice_inter(clientDetails.getAvg_traf_out_voice_inter());
            client.setAvg_traf_out_voice_roaming(clientDetails.getAvg_traf_out_voice_roaming());
            client.setAvg_traf_total(clientDetails.getAvg_traf_total());
            client.setAvg_volume_data_mo(clientDetails.getAvg_volume_data_mo());
            client.setRev_m3(clientDetails.getRev_m3());
            client.setRev_m2(clientDetails.getRev_m2());
            client.setRev_m1(clientDetails.getRev_m1());
            client.setAvg_real_rev(clientDetails.getAvg_real_rev());
            client.setPotential_max_rev(clientDetails.getPotential_max_rev());

            return clientRepository.save(client);
        }

        return null;
    }

    // DELETE
    public void deleteClient(int id) {
        clientRepository.deleteById(id);
    }

    public Client createOrUpdateClient(Client client) {

        // 1. chercher dans la base si clientReference existe déjà
        Optional<Client> existingClient = clientRepository.findByClientReference(client.getClientReference());

        // 2. si existe → UPDATE
        if (existingClient.isPresent()) {

            Client c = existingClient.get();

            c.setFull_name(client.getFull_name());
            c.setFlag_activity(client.getFlag_activity());
            c.setTenure(client.getTenure());

            c.setAvg_traf_out_voice_onnet(client.getAvg_traf_out_voice_onnet());
            c.setAvg_traf_out_voice_offnet(client.getAvg_traf_out_voice_offnet());
            c.setAvg_traf_out_voice_inter(client.getAvg_traf_out_voice_inter());
            c.setAvg_traf_out_voice_roaming(client.getAvg_traf_out_voice_roaming());
            c.setAvg_traf_total(client.getAvg_traf_total());

            c.setAvg_volume_data_mo(client.getAvg_volume_data_mo());

            c.setRev_m3(client.getRev_m3());
            c.setRev_m2(client.getRev_m2());
            c.setRev_m1(client.getRev_m1());

            c.setAvg_real_rev(client.getAvg_real_rev());
            c.setPotential_max_rev(client.getPotential_max_rev());

            return clientRepository.save(c);
        }

        // 3. sinon → INSERT
        return clientRepository.save(client);
    }

    public List<Client> createOrUpdateClients(List<Client> clients) {

        List<Client> savedClients = new ArrayList<>();

        for (Client client : clients) {

            Optional<Client> existing = clientRepository.findByClientReference(client.getClientReference());

            if (existing.isPresent()) {

                Client c = existing.get();

                c.setFull_name(client.getFull_name());
                c.setFlag_activity(client.getFlag_activity());
                c.setTenure(client.getTenure());

                c.setAvg_traf_out_voice_onnet(client.getAvg_traf_out_voice_onnet());
                c.setAvg_traf_out_voice_offnet(client.getAvg_traf_out_voice_offnet());
                c.setAvg_traf_out_voice_inter(client.getAvg_traf_out_voice_inter());
                c.setAvg_traf_out_voice_roaming(client.getAvg_traf_out_voice_roaming());
                c.setAvg_traf_total(client.getAvg_traf_total());

                c.setAvg_volume_data_mo(client.getAvg_volume_data_mo());

                c.setRev_m3(client.getRev_m3());
                c.setRev_m2(client.getRev_m2());
                c.setRev_m1(client.getRev_m1());

                c.setAvg_real_rev(client.getAvg_real_rev());
                c.setPotential_max_rev(client.getPotential_max_rev());

                savedClients.add(clientRepository.save(c));

            } else {

                savedClients.add(clientRepository.save(client));
            }
        }

        return savedClients;
    }

    public List<Client> importFromExcel(MultipartFile file) {

    List<Client> clients = new ArrayList<>();

    try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

        Sheet sheet = workbook.getSheetAt(0);

        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {

            Row row = sheet.getRow(i);

            Client client = new Client();

            client.setClientReference((int) row.getCell(0).getNumericCellValue());
            client.setFull_name(row.getCell(1).getStringCellValue());
            // flag_activity is stored as an integer in the Client entity
            client.setFlag_activity((int) row.getCell(2).getNumericCellValue());
            client.setTenure(Integer.valueOf((int) row.getCell(3).getNumericCellValue()));

            client.setAvg_traf_out_voice_onnet(row.getCell(4).getNumericCellValue());
            client.setAvg_traf_out_voice_offnet(row.getCell(5).getNumericCellValue());
            client.setAvg_traf_out_voice_inter(row.getCell(6).getNumericCellValue());
            client.setAvg_traf_out_voice_roaming(row.getCell(7).getNumericCellValue());
            client.setAvg_traf_total(row.getCell(8).getNumericCellValue());

            client.setAvg_volume_data_mo(row.getCell(9).getNumericCellValue());

            client.setRev_m3(row.getCell(10).getNumericCellValue());
            client.setRev_m2(row.getCell(11).getNumericCellValue());
            client.setRev_m1(row.getCell(12).getNumericCellValue());

            client.setAvg_real_rev(row.getCell(13).getNumericCellValue());
            client.setPotential_max_rev(row.getCell(14).getNumericCellValue());

            // UPSERT logique
            Optional<Client> existing =
                    clientRepository.findByClientReference(client.getClientReference());

            if (existing.isPresent()) {
                Client c = existing.get();

                c.setFull_name(client.getFull_name());
                c.setFlag_activity(client.getFlag_activity());
                c.setTenure(client.getTenure());

                c.setAvg_traf_out_voice_onnet(client.getAvg_traf_out_voice_onnet());
                c.setAvg_traf_out_voice_offnet(client.getAvg_traf_out_voice_offnet());
                c.setAvg_traf_out_voice_inter(client.getAvg_traf_out_voice_inter());
                c.setAvg_traf_out_voice_roaming(client.getAvg_traf_out_voice_roaming());
                c.setAvg_traf_total(client.getAvg_traf_total());

                c.setAvg_volume_data_mo(client.getAvg_volume_data_mo());

                c.setRev_m3(client.getRev_m3());
                c.setRev_m2(client.getRev_m2());
                c.setRev_m1(client.getRev_m1());

                c.setAvg_real_rev(client.getAvg_real_rev());
                c.setPotential_max_rev(client.getPotential_max_rev());

                clients.add(clientRepository.save(c));

            } else {
                clients.add(clientRepository.save(client));
            }
        }

    } catch (Exception e) {
        throw new RuntimeException("Error reading Excel file: " + e.getMessage());
    }

    return clients;
}

}
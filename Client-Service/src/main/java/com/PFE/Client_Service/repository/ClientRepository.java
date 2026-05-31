package com.PFE.Client_Service.repository;

import com.PFE.Client_Service.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

    Optional<Client> findByClientReference(Integer clientReference);

}

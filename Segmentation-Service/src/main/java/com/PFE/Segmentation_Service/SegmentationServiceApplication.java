package com.PFE.Segmentation_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@SpringBootApplication
@EnableTransactionManagement
@EnableKafka    
public class SegmentationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SegmentationServiceApplication.class, args);
	}

}

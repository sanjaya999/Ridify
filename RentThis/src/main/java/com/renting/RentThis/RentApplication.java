package com.renting.RentThis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.renting.RentThis.entity")
public class RentApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentApplication.class, args);
	}

}

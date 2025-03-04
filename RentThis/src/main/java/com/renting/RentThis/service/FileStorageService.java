package com.renting.RentThis.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private  final String uploadDir = "uploads/";

    public String saveFile(MultipartFile file){
        System.out.println("file recieved in filestorage "+ file);
        try{
            String fileName = UUID.randomUUID().toString()+ "_"+ file.getOriginalFilename();
            Path path = Paths.get(uploadDir, fileName);

            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream() , path);

            return uploadDir + fileName;


        } catch (IOException e) {
            throw new RuntimeException( "failed to upload photo in fileStorage " + e);
        }

    }
}

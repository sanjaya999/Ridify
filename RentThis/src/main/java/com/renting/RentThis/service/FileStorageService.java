package com.renting.RentThis.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${app.awsServices.bucketName}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    public String saveFile(MultipartFile file) {
        System.out.println("File received in FileStorage: " + file.getOriginalFilename());

        try {
            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Create metadata for the file
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Upload file to S3
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucketName,
                    fileName,
                    file.getInputStream(),
                    metadata
            );

            amazonS3.putObject(putObjectRequest);

            // Return the S3 URL
            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                    bucketName, region, fileName);

            System.out.println("File uploaded successfully to S3: " + fileUrl);
            return fileUrl;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }



}
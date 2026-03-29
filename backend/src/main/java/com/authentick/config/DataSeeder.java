package com.authentick.config;

import com.authentick.model.*;
import com.authentick.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Already seeded

        // Create demo admin
        User admin = User.builder()
                .name("Admin Demo")
                .email("admin@authentick.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .build();
        admin = userRepository.save(admin);

        // Create demo retailer
        User retailer = User.builder()
                .name("Retailer Demo")
                .email("retailer@authentick.com")
                .password(passwordEncoder.encode("retailer123"))
                .role(User.Role.RETAILER)
                .build();
        userRepository.save(retailer);

        // Create demo medicines
        String[][] meds = {
                {"Paracetamol 500mg", "PharmaCorp India", "Pain reliever and fever reducer", "Analgesic"},
                {"Amoxicillin 250mg", "MediLife Labs", "Antibiotic for bacterial infections", "Antibiotic"},
                {"Cetirizine 10mg", "HealthGuard Pharma", "Antihistamine for allergies", "Antihistamine"},
                {"Omeprazole 20mg", "CureTech Medicines", "Proton pump inhibitor for acidity", "Gastrointestinal"},
                {"Metformin 500mg", "DiaCare Labs", "Blood sugar control for diabetes", "Antidiabetic"},
        };

        for (String[] med : meds) {
            Medicine medicine = Medicine.builder()
                    .name(med[0])
                    .manufacturer(med[1])
                    .description(med[2])
                    .category(med[3])
                    .user(admin)
                    .build();
            medicine = medicineRepository.save(medicine);

            // Create a batch for each medicine
            Batch batch = Batch.builder()
                    .medicine(medicine)
                    .batchNumber("BATCH-" + medicine.getId() + "-2024")
                    .manufactureDate(LocalDate.of(2024, 1, 15))
                    .expiryDate(LocalDate.of(2026, 1, 15))
                    .quantity(5)
                    .isRecalled(false)
                    .user(admin)
                    .build();
            batch = batchRepository.save(batch);

            // Create products for each batch
            for (int i = 0; i < 5; i++) {
                String token = "DEMO-" + medicine.getId() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                Product product = Product.builder()
                        .batch(batch)
                        .token(token)
                        .qrData(token)
                        .scanCount(0)
                        .build();
                productRepository.save(product);
            }
        }

        // Create one expired batch
        Medicine expMed = medicineRepository.findAll().get(0);
        Batch expiredBatch = Batch.builder()
                .medicine(expMed)
                .batchNumber("BATCH-EXP-2023")
                .manufactureDate(LocalDate.of(2022, 1, 1))
                .expiryDate(LocalDate.of(2023, 6, 1))
                .quantity(2)
                .isRecalled(false)
                .user(admin)
                .build();
        expiredBatch = batchRepository.save(expiredBatch);

        for (int i = 0; i < 2; i++) {
            Product p = Product.builder()
                    .batch(expiredBatch)
                    .token("EXPIRED-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                    .qrData("EXPIRED-DEMO")
                    .scanCount(0)
                    .build();
            productRepository.save(p);
        }

        // Create one recalled batch
        Batch recalledBatch = Batch.builder()
                .medicine(expMed)
                .batchNumber("BATCH-RECALL-2024")
                .manufactureDate(LocalDate.of(2024, 3, 1))
                .expiryDate(LocalDate.of(2026, 3, 1))
                .quantity(2)
                .isRecalled(true)
                .user(admin)
                .build();
        recalledBatch = batchRepository.save(recalledBatch);

        for (int i = 0; i < 2; i++) {
            Product p = Product.builder()
                    .batch(recalledBatch)
                    .token("RECALLED-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                    .qrData("RECALLED-DEMO")
                    .scanCount(0)
                    .build();
            productRepository.save(p);
        }

        System.out.println("✅ Demo data seeded successfully!");
        System.out.println("   Admin: admin@authentick.com / admin123");
        System.out.println("   Retailer: retailer@authentick.com / retailer123");
    }
}

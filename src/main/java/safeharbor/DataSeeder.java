package safeharbor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DatasetRepository repository;

    public DataSeeder(DatasetRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            Dataset d1 = new Dataset();
            d1.setName("Alzheimer's cohort 2024");
            d1.setDescription("Synthetic patient records for AD research");
            d1.setSensitivity("CONTROLLED");
            repository.save(d1);

            Dataset d2 = new Dataset();
            d2.setName("Public cardiology summary");
            d2.setDescription("De-identified aggregate statistics");
            d2.setSensitivity("PUBLIC");
            repository.save(d2);
        }
    }
}
package safeharbor;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/datasets")
public class DatasetController {

    private final DatasetRepository repository;

    public DatasetController(DatasetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Dataset> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Dataset create(@RequestBody Dataset dataset) {
        return repository.save(dataset);
    }
}
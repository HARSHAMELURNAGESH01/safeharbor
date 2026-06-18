package safeharbor;

// Only non-identifying fields — no name, no SSN, no street address, no full date.
public record DeidentifiedPatient(
        String pseudoId,
        String birthYear,
        String gender,
        String state
) {}
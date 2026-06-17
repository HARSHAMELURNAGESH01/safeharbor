package safeharbor;

import jakarta.persistence.*;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String syntheaId;
    private String firstName;  // PHI
    private String lastName;   // PHI
    private String birthDate;  // PHI
    private String gender;
    private String ssn;        // PHI - highly sensitive
    private String address;    // PHI
    private String city;
    private String state;
    private String zip;        // PHI

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSyntheaId() { return syntheaId; }
    public void setSyntheaId(String syntheaId) { this.syntheaId = syntheaId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getSsn() { return ssn; }
    public void setSsn(String ssn) { this.ssn = ssn; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }
}
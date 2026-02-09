<?php
namespace App\Entity;

use App\Repository\PatientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PatientRepository::class)]
class Patient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le prénom est obligatoire')]
    private ?string $prenom = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank(message: "L'email est obligatoire")]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank(message: 'Le téléphone est obligatoire')]
    private ?string $telephone = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank(message: 'La date de naissance est obligatoire')]
    #[Assert\LessThan('today')]
    private ?\DateTimeInterface $dateNaissance = null;

    #[ORM\Column(length: 30, nullable: true)]
    private ?string $numeroSecuriteSociale = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(targetEntity: RendezVous::class, mappedBy: 'patient', orphanRemoval: true)]
    private Collection $rendezVous;

    public function __construct()
    {
        $this->rendezVous = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }
    public function getPrenom(): ?string { return $this->prenom; }
    public function setPrenom(string $prenom): static { $this->prenom = $prenom; return $this; }
    public function getNomComplet(): string { return $this->prenom . ' ' . $this->nom; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }
    public function getTelephone(): ?string { return $this->telephone; }
    public function setTelephone(string $telephone): static { $this->telephone = $telephone; return $this; }
    public function getDateNaissance(): ?\DateTimeInterface { return $this->dateNaissance; }
    public function setDateNaissance(\DateTimeInterface $dateNaissance): static { $this->dateNaissance = $dateNaissance; return $this; }
    public function getNumeroSecuriteSociale(): ?string { return $this->numeroSecuriteSociale; }
    public function setNumeroSecuriteSociale(?string $v): static { $this->numeroSecuriteSociale = $v; return $this; }
    public function getAdresse(): ?string { return $this->adresse; }
    public function setAdresse(?string $adresse): static { $this->adresse = $adresse; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function setCreatedAt(\DateTimeImmutable $v): static { $this->createdAt = $v; return $this; }
    public function getRendezVous(): Collection { return $this->rendezVous; }

    public function addRendezVous(RendezVous $r): static
    {
        if (!$this->rendezVous->contains($r)) { $this->rendezVous->add($r); $r->setPatient($this); }
        return $this;
    }

    public function removeRendezVous(RendezVous $r): static
    {
        if ($this->rendezVous->removeElement($r) && $r->getPatient() === $this) { $r->setPatient(null); }
        return $this;
    }

    public function __toString(): string { return $this->getNomComplet(); }
}

<?php
namespace App\Entity;

use App\Repository\MedecinRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MedecinRepository::class)]
class Medecin
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $prenom = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $specialite = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    private ?string $telephone = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $numeroOrdre = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresseCabinet = null;

    #[ORM\Column(nullable: true)]
    private ?float $honoraires = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(targetEntity: RendezVous::class, mappedBy: 'medecin', orphanRemoval: true)]
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
    public function getNomComplet(): string { return 'Dr. ' . $this->prenom . ' ' . $this->nom; }
    public function getSpecialite(): ?string { return $this->specialite; }
    public function setSpecialite(string $v): static { $this->specialite = $v; return $this; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }
    public function getTelephone(): ?string { return $this->telephone; }
    public function setTelephone(string $v): static { $this->telephone = $v; return $this; }
    public function getNumeroOrdre(): ?string { return $this->numeroOrdre; }
    public function setNumeroOrdre(?string $v): static { $this->numeroOrdre = $v; return $this; }
    public function getAdresseCabinet(): ?string { return $this->adresseCabinet; }
    public function setAdresseCabinet(?string $v): static { $this->adresseCabinet = $v; return $this; }
    public function getHonoraires(): ?float { return $this->honoraires; }
    public function setHonoraires(?float $v): static { $this->honoraires = $v; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function setCreatedAt(\DateTimeImmutable $v): static { $this->createdAt = $v; return $this; }
    public function getRendezVous(): Collection { return $this->rendezVous; }

    public function addRendezVous(RendezVous $r): static
    {
        if (!$this->rendezVous->contains($r)) { $this->rendezVous->add($r); $r->setMedecin($this); }
        return $this;
    }

    public function removeRendezVous(RendezVous $r): static
    {
        if ($this->rendezVous->removeElement($r) && $r->getMedecin() === $this) { $r->setMedecin(null); }
        return $this;
    }

    public function __toString(): string { return $this->getNomComplet() . ' (' . $this->specialite . ')'; }
}

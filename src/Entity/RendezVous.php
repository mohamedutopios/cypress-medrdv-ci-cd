<?php
namespace App\Entity;

use App\Repository\RendezVousRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RendezVousRepository::class)]
class RendezVous
{
    public const STATUT_EN_ATTENTE = 'en_attente';
    public const STATUT_CONFIRME = 'confirme';
    public const STATUT_ANNULE = 'annule';
    public const STATUT_TERMINE = 'termine';

    public const STATUTS = [
        'En attente' => self::STATUT_EN_ATTENTE,
        'Confirmé' => self::STATUT_CONFIRME,
        'Annulé' => self::STATUT_ANNULE,
        'Terminé' => self::STATUT_TERMINE,
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'rendezVous')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(inversedBy: 'rendezVous')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    private ?Medecin $medecin = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $dateHeure = null;

    #[ORM\Column]
    private int $dureeMinutes = 30;

    #[ORM\Column(length: 20)]
    private string $statut = self::STATUT_EN_ATTENTE;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $motif = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct() { $this->createdAt = new \DateTimeImmutable(); }

    public function getId(): ?int { return $this->id; }
    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(?Patient $v): static { $this->patient = $v; return $this; }
    public function getMedecin(): ?Medecin { return $this->medecin; }
    public function setMedecin(?Medecin $v): static { $this->medecin = $v; return $this; }
    public function getDateHeure(): ?\DateTimeInterface { return $this->dateHeure; }
    public function setDateHeure(\DateTimeInterface $v): static { $this->dateHeure = $v; return $this; }
    public function getDureeMinutes(): int { return $this->dureeMinutes; }
    public function setDureeMinutes(int $v): static { $this->dureeMinutes = $v; return $this; }
    public function getStatut(): string { return $this->statut; }
    public function setStatut(string $v): static { $this->statut = $v; $this->updatedAt = new \DateTimeImmutable(); return $this; }
    public function getMotif(): ?string { return $this->motif; }
    public function setMotif(?string $v): static { $this->motif = $v; return $this; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $v): static { $this->notes = $v; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function setCreatedAt(\DateTimeImmutable $v): static { $this->createdAt = $v; return $this; }
    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }

    public function getStatutLabel(): string
    {
        return array_search($this->statut, self::STATUTS) ?: $this->statut;
    }

    public function getStatutBadgeClass(): string
    {
        return match ($this->statut) {
            self::STATUT_EN_ATTENTE => 'bg-warning text-dark',
            self::STATUT_CONFIRME => 'bg-success',
            self::STATUT_ANNULE => 'bg-danger',
            self::STATUT_TERMINE => 'bg-secondary',
            default => 'bg-info',
        };
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        if (!$this->dateHeure) return null;
        return (clone $this->dateHeure)->modify('+' . $this->dureeMinutes . ' minutes');
    }

    public function __toString(): string
    {
        return sprintf('RDV #%d - %s avec %s le %s',
            $this->id ?? 0,
            $this->patient?->getNomComplet() ?? '?',
            $this->medecin?->getNomComplet() ?? '?',
            $this->dateHeure?->format('d/m/Y H:i') ?? '?'
        );
    }
}

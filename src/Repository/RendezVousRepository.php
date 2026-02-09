<?php
namespace App\Repository;

use App\Entity\Medecin;
use App\Entity\Patient;
use App\Entity\RendezVous;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RendezVousRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, RendezVous::class); }

    public function findUpcoming(int $limit = 10): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.patient', 'p')->join('r.medecin', 'm')->addSelect('p', 'm')
            ->where('r.dateHeure >= :now')->andWhere('r.statut != :a')
            ->setParameter('now', new \DateTime())->setParameter('a', RendezVous::STATUT_ANNULE)
            ->orderBy('r.dateHeure', 'ASC')->setMaxResults($limit)
            ->getQuery()->getResult();
    }

    public function findByPatient(Patient $patient): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.medecin', 'm')->addSelect('m')
            ->where('r.patient = :p')->setParameter('p', $patient)
            ->orderBy('r.dateHeure', 'DESC')->getQuery()->getResult();
    }

    public function findByMedecin(Medecin $medecin): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.patient', 'p')->addSelect('p')
            ->where('r.medecin = :m')->setParameter('m', $medecin)
            ->orderBy('r.dateHeure', 'DESC')->getQuery()->getResult();
    }

    public function findAll(): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.patient', 'p')->join('r.medecin', 'm')->addSelect('p', 'm')
            ->orderBy('r.dateHeure', 'DESC')->getQuery()->getResult();
    }

    public function countByStatut(): array
    {
        return $this->createQueryBuilder('r')
            ->select('r.statut, COUNT(r.id) as total')
            ->groupBy('r.statut')->getQuery()->getResult();
    }

    public function findTodayRendezVous(): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.patient', 'p')->join('r.medecin', 'm')->addSelect('p', 'm')
            ->where('r.dateHeure >= :today')->andWhere('r.dateHeure < :tomorrow')
            ->setParameter('today', new \DateTime('today'))
            ->setParameter('tomorrow', new \DateTime('tomorrow'))
            ->orderBy('r.dateHeure', 'ASC')->getQuery()->getResult();
    }
}

<?php
namespace App\Repository;

use App\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PatientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, Patient::class); }

    public function findBySearch(string $search): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.nom LIKE :s OR p.prenom LIKE :s OR p.email LIKE :s')
            ->setParameter('s', '%' . $search . '%')
            ->orderBy('p.nom', 'ASC')
            ->getQuery()->getResult();
    }
}

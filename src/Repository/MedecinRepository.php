<?php
namespace App\Repository;

use App\Entity\Medecin;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class MedecinRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, Medecin::class); }

    public function findBySpecialite(string $specialite): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.specialite = :s')->setParameter('s', $specialite)
            ->orderBy('m.nom', 'ASC')->getQuery()->getResult();
    }

    public function findAllSpecialites(): array
    {
        return $this->createQueryBuilder('m')
            ->select('DISTINCT m.specialite')
            ->orderBy('m.specialite', 'ASC')
            ->getQuery()->getSingleColumnResult();
    }
}

<?php
namespace App\DataFixtures;

use App\Entity\{Medecin, Patient, RendezVous};
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $medecins = [];
        foreach ([
            ['Martin','Sophie','Médecine générale','dr.martin@cabinet.fr','0145678901','ORD001','12 rue de Rivoli, 75001 Paris',25.0],
            ['Dubois','Pierre','Cardiologie','dr.dubois@cardio.fr','0145678902','ORD002','45 avenue Foch, 75016 Paris',60.0],
            ['Bernard','Marie','Dermatologie','dr.bernard@dermato.fr','0145678903','ORD003','8 bd Haussmann, 75009 Paris',50.0],
            ['Petit','Jean','Pédiatrie','dr.petit@pediatrie.fr','0145678904','ORD004','23 rue de la Paix, 75002 Paris',35.0],
            ['Moreau','Claire','Gynécologie','dr.moreau@gyneco.fr','0145678905','ORD005','67 rue St-Honoré, 75001 Paris',55.0],
            ['Laurent','Philippe','Ophtalmologie','dr.laurent@ophtalmo.fr','0145678906','ORD006','15 place Vendôme, 75001 Paris',45.0],
            ['Garcia','Ana','Psychiatrie','dr.garcia@psy.fr','0145678907','ORD007','34 rue de Vaugirard, 75006 Paris',70.0],
            ['Roux','François','ORL','dr.roux@orl.fr','0145678908','ORD008','9 rue Marbeuf, 75008 Paris',50.0],
        ] as $d) {
            $m = (new Medecin())->setNom($d[0])->setPrenom($d[1])->setSpecialite($d[2])->setEmail($d[3])->setTelephone($d[4])->setNumeroOrdre($d[5])->setAdresseCabinet($d[6])->setHonoraires($d[7]);
            $manager->persist($m); $medecins[] = $m;
        }

        $patients = [];
        foreach ([
            ['Dupont','Jean','jean.dupont@email.fr','0612345678','1985-03-15','185037510812','5 rue République, 75003'],
            ['Leroy','Marie','marie.leroy@email.fr','0623456789','1990-07-22','290079201523','18 av Champs-Élysées, 75008'],
            ['Girard','Lucas','lucas.girard@email.fr','0634567890','1978-11-08','178116938834','42 rue Fg St-Antoine, 75012'],
            ['Bonnet','Emma','emma.bonnet@email.fr','0645678901','1995-01-30','295011305545','7 place Bastille, 75004'],
            ['Fournier','Thomas','thomas.fournier@email.fr','0656789012','1982-09-12','182093306356','29 bd St-Germain, 75005'],
            ['Lambert','Camille','camille.lambert@email.fr','0667890123','2000-05-25','200055935067','11 rue Montmartre, 75001'],
            ['Morel','Hugo','hugo.morel@email.fr','0678901234','1972-12-03','172124410978','56 rue Belleville, 75020'],
            ['Simon','Léa','lea.simon@email.fr','0689012345','1988-06-18','288067511289','3 rue du Temple, 75003'],
            ['Michel','Antoine','antoine.michel@email.fr','0690123456','1965-04-07','165043818990','88 av Grande Armée, 75017'],
            ['Rousseau','Julie','julie.rousseau@email.fr','0601234567','2003-10-14','203100607801','21 rue Oberkampf, 75011'],
        ] as $d) {
            $p = (new Patient())->setNom($d[0])->setPrenom($d[1])->setEmail($d[2])->setTelephone($d[3])->setDateNaissance(new \DateTime($d[4]))->setNumeroSecuriteSociale($d[5])->setAdresse($d[6]);
            $manager->persist($p); $patients[] = $p;
        }

        $motifs = ['Consultation de routine','Douleurs thoraciques','Contrôle annuel','Renouvellement ordonnance','Mal de tête persistant','Vaccination','Bilan sanguin','Suivi post-op','Examen dermato','Trouble du sommeil','Suivi','Douleurs articulaires'];

        foreach ([
            [0,0,'-15 days 09:00',30,'termine',0],
            [1,1,'-12 days 14:00',45,'termine',1],
            [2,2,'-10 days 10:30',30,'termine',2],
            [3,3,'-8 days 11:00',30,'termine',5],
            [4,4,'-5 days 15:00',60,'termine',3],
            [5,0,'today 09:00',30,'confirme',4],
            [6,1,'today 10:30',45,'confirme',6],
            [7,5,'today 14:00',30,'en_attente',8],
            [8,2,'+2 days 09:30',30,'confirme',7],
            [9,6,'+3 days 11:00',60,'en_attente',9],
            [0,3,'+5 days 14:30',30,'en_attente',10],
            [1,7,'+7 days 16:00',45,'en_attente',11],
            [3,0,'+10 days 10:00',30,'en_attente',0],
            [5,4,'+12 days 09:00',60,'confirme',3],
            [2,0,'+1 day 11:00',30,'annule',4],
        ] as $d) {
            $r = (new RendezVous())->setPatient($patients[$d[0]])->setMedecin($medecins[$d[1]])->setDateHeure(new \DateTime($d[2]))->setDureeMinutes($d[3])->setStatut($d[4])->setMotif($motifs[$d[5]]);
            if ($d[4] === 'termine') $r->setNotes('Consultation effectuée.');
            $manager->persist($r);
        }

        $manager->flush();
    }
}

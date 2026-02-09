<?php
namespace App\Controller;

use App\Repository\{MedecinRepository, PatientRepository, RendezVousRepository};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(PatientRepository $pr, MedecinRepository $mr, RendezVousRepository $rr): Response
    {
        return $this->render('dashboard/index.html.twig', [
            'totalPatients' => count($pr->findAll()),
            'totalMedecins' => count($mr->findAll()),
            'rdvAujourdhui' => $rr->findTodayRendezVous(),
            'prochains_rdv' => $rr->findUpcoming(5),
            'statsStatut' => $rr->countByStatut(),
        ]);
    }
}

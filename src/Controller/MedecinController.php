<?php
namespace App\Controller;

use App\Entity\Medecin;
use App\Form\MedecinType;
use App\Repository\{MedecinRepository, RendezVousRepository};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\Routing\Attribute\Route;

#[Route('/medecin')]
class MedecinController extends AbstractController
{
    #[Route('', name: 'app_medecin_index', methods: ['GET'])]
    public function index(MedecinRepository $repo, Request $r): Response
    {
        $spec = $r->query->get('specialite', '');
        return $this->render('medecin/index.html.twig', [
            'medecins' => $spec ? $repo->findBySpecialite($spec) : $repo->findBy([], ['nom' => 'ASC']),
            'specialites' => $repo->findAllSpecialites(),
            'currentSpecialite' => $spec,
        ]);
    }

    #[Route('/new', name: 'app_medecin_new', methods: ['GET', 'POST'])]
    public function new(Request $r, EntityManagerInterface $em): Response
    {
        $medecin = new Medecin();
        $form = $this->createForm(MedecinType::class, $medecin);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($medecin); $em->flush();
            $this->addFlash('success', 'Médecin ajouté.');
            return $this->redirectToRoute('app_medecin_index');
        }
        return $this->render('medecin/new.html.twig', ['medecin' => $medecin, 'form' => $form]);
    }

    #[Route('/{id}', name: 'app_medecin_show', methods: ['GET'])]
    public function show(Medecin $medecin, RendezVousRepository $rr): Response
    {
        return $this->render('medecin/show.html.twig', [
            'medecin' => $medecin, 'rendez_vous' => $rr->findByMedecin($medecin),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_medecin_edit', methods: ['GET', 'POST'])]
    public function edit(Request $r, Medecin $medecin, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(MedecinType::class, $medecin);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Médecin modifié.');
            return $this->redirectToRoute('app_medecin_show', ['id' => $medecin->getId()]);
        }
        return $this->render('medecin/edit.html.twig', ['medecin' => $medecin, 'form' => $form]);
    }

    #[Route('/{id}/delete', name: 'app_medecin_delete', methods: ['POST'])]
    public function delete(Request $r, Medecin $medecin, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$medecin->getId(), $r->request->get('_token'))) {
            $em->remove($medecin); $em->flush();
            $this->addFlash('success', 'Médecin supprimé.');
        }
        return $this->redirectToRoute('app_medecin_index');
    }
}

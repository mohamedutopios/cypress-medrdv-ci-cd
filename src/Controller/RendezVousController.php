<?php
namespace App\Controller;

use App\Entity\RendezVous;
use App\Form\RendezVousType;
use App\Repository\RendezVousRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\Routing\Attribute\Route;

#[Route('/rendezvous')]
class RendezVousController extends AbstractController
{
    #[Route('', name: 'app_rendezvous_index', methods: ['GET'])]
    public function index(RendezVousRepository $repo, Request $r): Response
    {
        $statut = $r->query->get('statut', '');
        return $this->render('rendezvous/index.html.twig', [
            'rendez_vous' => $statut ? $repo->findBy(['statut' => $statut], ['dateHeure' => 'DESC']) : $repo->findAll(),
            'currentStatut' => $statut,
        ]);
    }

    #[Route('/new', name: 'app_rendezvous_new', methods: ['GET', 'POST'])]
    public function new(Request $r, EntityManagerInterface $em): Response
    {
        $rdv = new RendezVous();
        $form = $this->createForm(RendezVousType::class, $rdv);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($rdv); $em->flush();
            $this->addFlash('success', 'Rendez-vous créé.');
            return $this->redirectToRoute('app_rendezvous_index');
        }
        return $this->render('rendezvous/new.html.twig', ['rendez_vous' => $rdv, 'form' => $form]);
    }

    #[Route('/{id}', name: 'app_rendezvous_show', methods: ['GET'])]
    public function show(RendezVous $rdv): Response
    {
        return $this->render('rendezvous/show.html.twig', ['rdv' => $rdv]);
    }

    #[Route('/{id}/edit', name: 'app_rendezvous_edit', methods: ['GET', 'POST'])]
    public function edit(Request $r, RendezVous $rdv, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(RendezVousType::class, $rdv);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Rendez-vous modifié.');
            return $this->redirectToRoute('app_rendezvous_show', ['id' => $rdv->getId()]);
        }
        return $this->render('rendezvous/edit.html.twig', ['rdv' => $rdv, 'form' => $form]);
    }

    #[Route('/{id}/statut/{statut}', name: 'app_rendezvous_statut', methods: ['POST'])]
    public function changeStatut(Request $r, RendezVous $rdv, string $statut, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('statut'.$rdv->getId(), $r->request->get('_token'))) {
            if (in_array($statut, RendezVous::STATUTS)) {
                $rdv->setStatut($statut); $em->flush();
                $this->addFlash('success', 'Statut mis à jour.');
            }
        }
        return $this->redirectToRoute('app_rendezvous_show', ['id' => $rdv->getId()]);
    }

    #[Route('/{id}/delete', name: 'app_rendezvous_delete', methods: ['POST'])]
    public function delete(Request $r, RendezVous $rdv, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$rdv->getId(), $r->request->get('_token'))) {
            $em->remove($rdv); $em->flush();
            $this->addFlash('success', 'Rendez-vous supprimé.');
        }
        return $this->redirectToRoute('app_rendezvous_index');
    }
}

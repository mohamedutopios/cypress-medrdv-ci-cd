<?php
namespace App\Controller;

use App\Entity\Patient;
use App\Form\PatientType;
use App\Repository\{PatientRepository, RendezVousRepository};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\Routing\Attribute\Route;

#[Route('/patient')]
class PatientController extends AbstractController
{
    #[Route('', name: 'app_patient_index', methods: ['GET'])]
    public function index(PatientRepository $repo, Request $r): Response
    {
        $q = $r->query->get('q', '');
        return $this->render('patient/index.html.twig', [
            'patients' => $q ? $repo->findBySearch($q) : $repo->findBy([], ['nom' => 'ASC']),
            'search' => $q,
        ]);
    }

    #[Route('/new', name: 'app_patient_new', methods: ['GET', 'POST'])]
    public function new(Request $r, EntityManagerInterface $em): Response
    {
        $patient = new Patient();
        $form = $this->createForm(PatientType::class, $patient);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($patient); $em->flush();
            $this->addFlash('success', 'Patient créé avec succès.');
            return $this->redirectToRoute('app_patient_index');
        }
        return $this->render('patient/new.html.twig', ['patient' => $patient, 'form' => $form]);
    }

    #[Route('/{id}', name: 'app_patient_show', methods: ['GET'])]
    public function show(Patient $patient, RendezVousRepository $rr): Response
    {
        return $this->render('patient/show.html.twig', [
            'patient' => $patient, 'rendez_vous' => $rr->findByPatient($patient),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_patient_edit', methods: ['GET', 'POST'])]
    public function edit(Request $r, Patient $patient, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(PatientType::class, $patient);
        $form->handleRequest($r);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Patient modifié.');
            return $this->redirectToRoute('app_patient_show', ['id' => $patient->getId()]);
        }
        return $this->render('patient/edit.html.twig', ['patient' => $patient, 'form' => $form]);
    }

    #[Route('/{id}/delete', name: 'app_patient_delete', methods: ['POST'])]
    public function delete(Request $r, Patient $patient, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$patient->getId(), $r->request->get('_token'))) {
            $em->remove($patient); $em->flush();
            $this->addFlash('success', 'Patient supprimé.');
        }
        return $this->redirectToRoute('app_patient_index');
    }
}

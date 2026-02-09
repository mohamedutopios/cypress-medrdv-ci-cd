<?php
namespace App\Form;

use App\Entity\{Medecin, Patient, RendezVous};
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\{ChoiceType, DateTimeType, TextareaType};
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RendezVousType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('patient', EntityType::class, ['class' => Patient::class, 'choice_label' => 'nomComplet', 'label' => 'Patient', 'placeholder' => 'Sélectionner...'])
            ->add('medecin', EntityType::class, ['class' => Medecin::class, 'choice_label' => fn(Medecin $m) => $m->getNomComplet().' ('.$m->getSpecialite().')', 'label' => 'Médecin', 'placeholder' => 'Sélectionner...'])
            ->add('dateHeure', DateTimeType::class, ['label' => 'Date et heure', 'widget' => 'single_text'])
            ->add('dureeMinutes', ChoiceType::class, ['label' => 'Durée', 'choices' => ['15 min' => 15, '30 min' => 30, '45 min' => 45, '1h' => 60, '1h30' => 90, '2h' => 120]])
            ->add('statut', ChoiceType::class, ['label' => 'Statut', 'choices' => RendezVous::STATUTS])
            ->add('motif', TextareaType::class, ['label' => 'Motif', 'required' => false, 'attr' => ['rows' => 3]])
            ->add('notes', TextareaType::class, ['label' => 'Notes', 'required' => false, 'attr' => ['rows' => 3]]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => RendezVous::class]);
    }
}

<?php
namespace App\Form;

use App\Entity\Medecin;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\{ChoiceType, EmailType, MoneyType, TelType, TextType};
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MedecinType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom', TextType::class, ['label' => 'Nom'])
            ->add('prenom', TextType::class, ['label' => 'Prénom'])
            ->add('specialite', ChoiceType::class, [
                'label' => 'Spécialité', 'placeholder' => 'Choisir...',
                'choices' => array_combine(
                    $s = ['Médecine générale','Cardiologie','Dermatologie','Gynécologie','Ophtalmologie','ORL','Pédiatrie','Psychiatrie','Radiologie','Rhumatologie','Chirurgie','Neurologie','Pneumologie','Urologie','Orthopédie'],
                    $s
                ),
            ])
            ->add('email', EmailType::class, ['label' => 'Email'])
            ->add('telephone', TelType::class, ['label' => 'Téléphone'])
            ->add('numeroOrdre', TextType::class, ['label' => "N° Ordre", 'required' => false])
            ->add('adresseCabinet', TextType::class, ['label' => 'Adresse du cabinet', 'required' => false])
            ->add('honoraires', MoneyType::class, ['label' => 'Honoraires', 'required' => false, 'currency' => 'EUR']);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Medecin::class]);
    }
}

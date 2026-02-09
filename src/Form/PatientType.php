<?php
namespace App\Form;

use App\Entity\Patient;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\{DateType, EmailType, TelType, TextType};
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PatientType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom', TextType::class, ['label' => 'Nom', 'attr' => ['placeholder' => 'Dupont']])
            ->add('prenom', TextType::class, ['label' => 'Prénom', 'attr' => ['placeholder' => 'Jean']])
            ->add('email', EmailType::class, ['label' => 'Email', 'attr' => ['placeholder' => 'jean.dupont@email.com']])
            ->add('telephone', TelType::class, ['label' => 'Téléphone', 'attr' => ['placeholder' => '06 12 34 56 78']])
            ->add('dateNaissance', DateType::class, ['label' => 'Date de naissance', 'widget' => 'single_text'])
            ->add('numeroSecuriteSociale', TextType::class, ['label' => 'N° Sécurité Sociale', 'required' => false])
            ->add('adresse', TextType::class, ['label' => 'Adresse', 'required' => false]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Patient::class]);
    }
}

import { AccueilModel } from '../models/accueil.model';

export const useAccueilController = () => {
  
  const description = AccueilModel.description;
  const labels = AccueilModel.labels;

  return {
    description,
    labels
  };
};
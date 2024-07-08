import { useState, useEffect } from "react";
import { decryptFeature } from "./featureEncryption";

const useDecryptedFeature = () => {
  const [features, setFeatures] = useState(() => decryptFeature());

  useEffect(() => {
    const interval = setInterval(() => {
      const newFeatures = decryptFeature();
      if (JSON.stringify(newFeatures) !== JSON.stringify(features)) {
        setFeatures(newFeatures);
      }
    }, 5000); // Check every 5 seconds (adjust as necessary)

    return () => clearInterval(interval);
  }, [features]);

  return features;
};

export default useDecryptedFeature;

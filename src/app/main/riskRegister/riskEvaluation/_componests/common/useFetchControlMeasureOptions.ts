import { useState, useEffect } from "react";
import axios from "axios";
import { ControlMeasuresType } from "../../../helpers/enum"; // Adjust the import path as necessary
import { apiAuth } from "src/utils/http";
import { ISelectedControlMeasures } from "../../../helpers/type";

const useFetchControlMeasureOptions = (
  controlMeasureType: number
): {
  options: ISelectedControlMeasures[];
  loading: boolean;
  error: string | null;
} => {
  const [options, setOptions] = useState<ISelectedControlMeasures[]>([
    {
      title: "Training on Golden Rule No. 4: Protective equipment. ",
      id: 2002,
    },
    {
      title:
        "Training on Golden Rule No. 3: Body Mechanics and Tools. Lighting Using ergonomic equipment (work seat, etc.)",
      id: 1995,
    },
    {
      title: "Training on Golden Rule No. 3: Body Mechanics and Tools. ",
      id: 1991,
    },
    {
      title:
        "Training on Golden Rule No. 2: Traffic. Flow diagram, pedestrian paths, walkways, etc.",
      id: 1946,
    },
    {
      title:
        "Vehicle maintenance contract Quality of safety equipment for rentals Group Safety Directive Golden Rules",
      id: 1997,
    },
    {
      title:
        "Training on Golden Rule No. 10: Working at height. Reminder:  inspection plan ",
      id: 1995,
    },
    {
      title: "Training in the management of stress and the priority",
      id: 1994,
    },
    {
      title:
        "Training on Golden Rule No. 7: Powered systems. Periodic inspection of equipment by an approved body",
      id: 2001,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url = "";
    switch (controlMeasureType) {
      case ControlMeasuresType.Human:
        url = "https://mocapi.tebs.co.in/api/LookupData/Lov/32";
        break;
      case ControlMeasuresType.Organizational:
        url = "https://mocapi.tebs.co.in/api/LookupData/Lov/34";
        break;
      case ControlMeasuresType.Technical:
        url = "https://mocapi.tebs.co.in/api/LookupData/Lov/33"; // Example URL, adjust as necessary
        break;
      default:
        setError("Invalid controlMeasureType");
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      try {
        const response = await apiAuth.get(url);
        const data = response.data.data.map((item: any) => ({
          title: item.text,
          id: item.value,
        }));
        setOptions(data as ISelectedControlMeasures[]);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [controlMeasureType]);

  return { options, loading, error };
};

export default useFetchControlMeasureOptions;

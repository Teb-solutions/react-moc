import React from 'react';
import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import { useRatingStore } from "../../ratingStore";

interface RatingTableProps {
  setResidualRating?: (rating: number | null) => void;
}

const ManualLoadHandlingPushPull = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border border-gray-400">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border border-gray-400">Reduction of P</th>
          <th className="py-2 px-4 border border-gray-400">
            Means/measures of prevention/protection (pulling/pushing)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -1
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>
              <strong>
                <u>At least two procedural or organizational measures from:</u>
              </strong>
            </p>
            <p>
              - Organizational measures: reducing effort by working in twos,
              alternating tasks, breaks, limiting movements
            </p>
            <p>- Large-wheeled cart for transporting loads</p>
            <p>- Easier gripping</p>
            <p>- Training</p>
            <p>- Warm-up exercises, etc.</p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -2
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>
              <strong>
                <u>
                  Technical adaptation of the workplace to significantly reduce
                  the ergonomic strains:
                </u>
              </strong>
            </p>
            <p>- Reduction of parcel load, pallets</p>
            <p>- Use of assisted pipe unwinders</p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -3
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>
              <strong>
                <u>
                  Technical adaptation of the workplace to significantly reduce
                  the ergonomic strains:
                </u>
              </strong>
            </p>
            <p>
              - Mechanical load handling system, forklift, electric cart, etc.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ManualLoadHandlingUnitMass = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Reduction of P</th>
          <th className="py-10 px-4 border">
            Means/measures of prevention/protection (handling)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <ul className="list-disc pl-20">
              <li>Do warm-up exercises</li>
              <li>Follow acts and posture training</li>
              <li>Limit handling, take breaks, draw up a roster, etc.</li>
              <li>Improve grip, transport distance, etc.</li>
            </ul>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to significantly reduce
                the ergonomic strains:
              </u>
            </strong>
            <ul className="list-disc pl-20">
              <li>
                Provide load-handling assistance systems to reduce the weight of
                the load (hand-trucks, trans-pallets, dolly carts, cable reels,
                etc.)
              </li>
              <li>Reduce the weight of the packaging, etc.</li>
            </ul>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to drastically reduce the
                ergonomic strains:
              </u>
            </strong>
            <ul className="list-disc pl-20">
              <li>
                Put in place a mechanical load handling system, forklift,
                electric cart, etc.
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PostureStrain = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection (posture strains)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- Alternate tasks, take regular breaks to relax muscles, etc.</p>
            <p>
              - Warm-up and warm-down exercises, good acts and postures training
            </p>
            <p>
              - Avoid twisting by arranging the workplace (e.g. multiple
              screens, desk at an angle when the screen is lateral (due to the
              lighting), cash register with equipment not positioned
              practically/logically, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to significantly reduce
                the ergonomic strains:
              </u>
            </strong>
            <p>
              - Improve the workplace so that the arms are not raised above the
              chest and the trunk is straighter: improve the height at which
              work is done, gripping distances, provide adapted tools, etc.
            </p>
            <p>
              - Arrange the workspace: avoid differences in level, ladders,
              stairs, movements, handling, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to drastically reduce the
                ergonomic strains:
              </u>
            </strong>
            <p>
              - Mechanical assistance systems (e.g. height-adjustable table,
              etc.)
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const RepetitiveMovement = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection (repetitive movements)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- Alternate tasks, take regular breaks to relax muscles, etc.</p>
            <p>
              - Warm-up and warm-down exercises, good acts and postures training
            </p>
            <p>
              - Avoid twisting by arranging the workplace (e.g. multiple
              screens, desk at an angle when the screen is lateral (due to the
              lighting), cash register with equipment not positioned
              practically/logically, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to significantly reduce
                the ergonomic strains:
              </u>
            </strong>
            <p>
              - Improve the workplace so that the arms are not raised above the
              chest and the trunk is straighter: improve the height at which
              work is done, gripping distances, provide adapted tools, etc.
            </p>
            <p>
              - Arrange the workspace: avoid differences in level, ladders,
              stairs, movements, handling, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to drastically reduce the
                ergonomic strains:
              </u>
            </strong>
            <p>
              - Mechanical assistance systems (e.g. height-adjustable table,
              etc.)
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Static = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection (static postures)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- Alternate tasks, take regular breaks to relax muscles, etc.</p>
            <p>
              - Warm-up and warm-down exercises, good acts and postures training
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to significantly reduce
                the ergonomic strains:
              </u>
            </strong>
            <p>
              - Improve the workplace so that the arms are not raised above the
              chest and the trunk is straighter: improve the height at which
              work is done, gripping distances, provide adapted tools, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to drastically reduce the
                ergonomic strains:
              </u>
            </strong>
            <p>
              - Mechanical assistance systems (e.g. height-adjustable table,
              etc.)
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const WorkAtmosphere = ({ setResidualRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    if (setResidualRating) {
      setResidualRating(rating);
    }
    setResidualProbabilityRating(rating);
  };

  React.useEffect(() => {
    if (residualProbabilityRating !== null) {
      setSelectedRating(residualProbabilityRating);
    }
  }, [residualProbabilityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection (work atmosphere)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- Alternate tasks, take regular breaks to relax muscles, etc.</p>
            <p>
              - Warm-up and warm-down exercises, good acts and postures training
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to significantly reduce
                the ergonomic strains:
              </u>
            </strong>
            <p>
              - Improve the workplace so that the arms are not raised above the
              chest and the trunk is straighter: improve the height at which
              work is done, gripping distances, provide adapted tools, etc.
            </p>
          </td>
        </tr>
        <tr
          onClick={() => handleClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Technical adaptation of the workplace to drastically reduce the
                ergonomic strains:
              </u>
            </strong>
            <p>
              - Mechanical assistance systems (e.g. height-adjustable table,
              etc.)
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.manualloadhandlingunitmass:
      return ManualLoadHandlingUnitMass;
    case subCategoryList.manualloadhandlingpushpull:
      return ManualLoadHandlingPushPull;
    case subCategoryList.posturestrain:
      return PostureStrain;
    case subCategoryList.repetitivemovement:
      return RepetitiveMovement;
    case subCategoryList.static:
      return Static;
    case subCategoryList.workatmosphere:
      return WorkAtmosphere;
    default:
      return ManualLoadHandlingUnitMass;
  }
};

export const ResidualRatingTable = ({ setResidualRating }: RatingTableProps) => {
  const { subCategory } = useSubCategoryStore();
  const Component = getCategoryComponent(subCategory);
  return <Component setResidualRating={setResidualRating} />;
};

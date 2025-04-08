export const DownloadPdf =({
    hazardTypeWatch,
    hazardTypes,
  }: {
    hazardTypeWatch: number;
    hazardTypes: { value: number; text: string }[];
  }) => {
    return (
        <div className="flex justify-left items-left">
            <a href={
                `/assets/pdfs/${hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
                    ?.text}.pdf`
            } download={true} target="_blank"  className="text-blue-500 underline font-semibold ">
                Download GM-GR-HSE-300 Appendix for{" "}
                {
                    hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
                        ?.text
                }
            </a>
        </div>
    );
}
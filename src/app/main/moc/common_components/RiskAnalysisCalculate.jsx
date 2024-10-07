import { apiAuth } from "src/utils/http";

export const CalculateFrequencyScoring = (text) => {
    if (["t < 2.4min", "t < 0.2h", "t < 0.8h", "t < 8.5h"].includes(text)) {
        return 0.5;
    } else if (
        [
            "2.4 <= t < 24min",
            "0.2 <= t < 2h",
            "0.8 <= t < 8h",
            "8.5 <= t < 85h",
        ].includes(text)
    ) {
        return 1;
    } else if (
        [
            "24min <= t < 1.6h",
            "2 <= t < 8h",
            "8 <= t < 32h",
            "85 <= t < 340h",
        ].includes(text)
    ) {
        return 2;
    } else if (
        [
            "1.6 <= t < 4h",
            "8 <= t < 20h",
            "32 <= t < 80h",
            "340 <= t < 850h",
        ].includes(text)
    ) {
        return 3;
    } else if (
        [
            "4 <= t < 6h",
            "20 <= t < 30h",
            "80 <= t < 120h",
            "850 <= t < 1275h",
        ].includes(text)
    ) {
        return 6;
    } else {
        return 10;
    }
};



export const CalculatePotentialRisk = (
    frequencyScoring,
    likelihoodScoring,
    severityScoring
) => {
    if (
        frequencyScoring &&
        likelihoodScoring &&
        severityScoring &&
        likelihoodScoring <= 15 &&
        likelihoodScoring > 0 &&
        severityScoring <= 15 &&
        severityScoring > 0
    ) {
        return frequencyScoring * likelihoodScoring * severityScoring;
    } else {
        return "";
    }
};


export const CalculateRiskClassification = (residualRisk) => {
    let classification = "";
    let classificationValue = "";

    if (residualRisk > 400) {
        classification = "HighRisk";
        classificationValue = "1";
    } else if (residualRisk > 200 && residualRisk <= 400) {
        classification = "SignificantRisk";
        classificationValue = "2";
    } else if (residualRisk > 70 && residualRisk <= 200) {
        classification = "AverageRisk";
        classificationValue = "3";
    } else if (residualRisk > 20 && residualRisk <= 70) {
        classification = "LowRisk";
        classificationValue = "4";
    } else if (residualRisk <= 20) {
        classification = "VeryLowRisk";
        classificationValue = "5";
    }

    return { classification, classificationValue };
};



export const HandleGeneralGuideClick = (setGeneralGuidePdf) => {
    apiAuth
        .get(`/RiskAnalysis/downloadGeneral`, {
            responseType: "blob",
        })
        .then(async (resp) => {
            await setGeneralGuidePdf(resp?.data);
        });
};
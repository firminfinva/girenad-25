"use client";
import { useState } from "react";

interface RelatedEntitiesFormProps {
  specificObjectives: Array<{ id?: string; content: string; order: number }>;
  mainActivities: Array<{ id?: string; content: string; order: number }>;
  partners: Array<{ id?: string; name: string; type: string }>;
  expectedResults: Array<{ id?: string; content: string; order: number }>;
  onSpecificObjectivesChange: (
    items: Array<{ id?: string; content: string; order: number }>
  ) => void;
  onMainActivitiesChange: (
    items: Array<{ id?: string; content: string; order: number }>
  ) => void;
  onPartnersChange: (
    items: Array<{ id?: string; name: string; type: string }>
  ) => void;
  onExpectedResultsChange: (
    items: Array<{ id?: string; content: string; order: number }>
  ) => void;
}

const RelatedEntitiesForm: React.FC<RelatedEntitiesFormProps> = ({
  specificObjectives,
  mainActivities,
  partners,
  expectedResults,
  onSpecificObjectivesChange,
  onMainActivitiesChange,
  onPartnersChange,
  onExpectedResultsChange,
}) => {
  const addSpecificObjective = () => {
    onSpecificObjectivesChange([
      ...specificObjectives,
      { content: "", order: specificObjectives.length + 1 },
    ]);
  };

  const updateSpecificObjective = (index: number, content: string) => {
    const updated = [...specificObjectives];
    updated[index] = { ...updated[index], content };
    onSpecificObjectivesChange(updated);
  };

  const removeSpecificObjective = (index: number) => {
    const updated = specificObjectives.filter((_, i) => i !== index);
    updated.forEach((item, i) => {
      item.order = i + 1;
    });
    onSpecificObjectivesChange(updated);
  };

  const addMainActivity = () => {
    onMainActivitiesChange([
      ...mainActivities,
      { content: "", order: mainActivities.length + 1 },
    ]);
  };

  const updateMainActivity = (index: number, content: string) => {
    const updated = [...mainActivities];
    updated[index] = { ...updated[index], content };
    onMainActivitiesChange(updated);
  };

  const removeMainActivity = (index: number) => {
    const updated = mainActivities.filter((_, i) => i !== index);
    updated.forEach((item, i) => {
      item.order = i + 1;
    });
    onMainActivitiesChange(updated);
  };

  const addPartner = () => {
    onPartnersChange([...partners, { name: "", type: "DONOR" }]);
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    onPartnersChange(updated);
  };

  const removePartner = (index: number) => {
    onPartnersChange(partners.filter((_, i) => i !== index));
  };

  const addExpectedResult = () => {
    onExpectedResultsChange([
      ...expectedResults,
      { content: "", order: expectedResults.length + 1 },
    ]);
  };

  const updateExpectedResult = (index: number, content: string) => {
    const updated = [...expectedResults];
    updated[index] = { ...updated[index], content };
    onExpectedResultsChange(updated);
  };

  const removeExpectedResult = (index: number) => {
    const updated = expectedResults.filter((_, i) => i !== index);
    updated.forEach((item, i) => {
      item.order = i + 1;
    });
    onExpectedResultsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Specific Objectives */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Objectifs Spécifiques
          </h3>
          <button
            type="button"
            onClick={addSpecificObjective}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {specificObjectives.map((obj, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="mt-2 text-gray-500 font-medium">
                {index + 1}.
              </span>
              <textarea
                value={obj.content}
                onChange={(e) => updateSpecificObjective(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows={2}
                placeholder="Objectif spécifique..."
              />
              <button
                type="button"
                onClick={() => removeSpecificObjective(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Activities */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Activités Principales
          </h3>
          <button
            type="button"
            onClick={addMainActivity}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {mainActivities.map((act, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="mt-2 text-gray-500 font-medium">
                {index + 1}.
              </span>
              <textarea
                value={act.content}
                onChange={(e) => updateMainActivity(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows={2}
                placeholder="Activité principale..."
              />
              <button
                type="button"
                onClick={() => removeMainActivity(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Partenaires</h3>
          <button
            type="button"
            onClick={addPartner}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {partners.map((partner, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={partner.name}
                onChange={(e) => updatePartner(index, "name", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Nom du partenaire"
              />
              <select
                value={partner.type}
                onChange={(e) => updatePartner(index, "type", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="DONOR">Donateur</option>
                <option value="IMPLEMENTING_PARTNER">
                  Partenaire d'exécution
                </option>
                <option value="TECHNICAL_PARTNER">Partenaire technique</option>
                <option value="COMMUNITY_PARTNER">
                  Partenaire communautaire
                </option>
              </select>
              <button
                type="button"
                onClick={() => removePartner(index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Results */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Résultats Attendus
          </h3>
          <button
            type="button"
            onClick={addExpectedResult}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {expectedResults.map((result, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="mt-2 text-gray-500 font-medium">
                {index + 1}.
              </span>
              <textarea
                value={result.content}
                onChange={(e) => updateExpectedResult(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows={2}
                placeholder="Résultat attendu..."
              />
              <button
                type="button"
                onClick={() => removeExpectedResult(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedEntitiesForm;

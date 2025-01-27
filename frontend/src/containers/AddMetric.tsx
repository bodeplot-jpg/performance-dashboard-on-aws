import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { useDashboard, useSettings } from "../hooks";
import Spinner from "../components/Spinner";
import DateRangePicker from "../components/DateRangePicker";
import { LocationState } from "../models";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Dropdown from "../components/Dropdown";
import { CurrencyDataType, NumberDataType } from "../models";

interface FormValues {
  title: string;
  value: number;
  changeOverTime: string;
  percentage: string;
  currency: string;
}

interface PathParams {
  dashboardId: string;
}

function AddMetric() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [symbolType, setsymbolType] = useState<string>("Percentage");

  const onSubmit = async (values: FormValues) => {
    const newMetrics = state && state.metrics ? [...state.metrics] : [];
    newMetrics.push({
      title: values.title,
      value: values.value,
      changeOverTime: values.changeOverTime,
      percentage: values.percentage,
      currency: values.currency,
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
    });

    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        alert: {
          type: "success",
          message: t("AddMetricScreen.MetricSuccessfullyAdded"),
        },
        metrics: newMetrics,
        showTitle: state.showTitle !== false,
        oneMetricPerRow: state.oneMetricPerRow === true,
        metricTitle: state.metricTitle || "",
        datasetType: state.datasetType || undefined,
      }
    );
  };

  const handlePercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "Percentage") {
      setsymbolType("Percentage");
    } else if (e.target.value === "Currency") {
      setsymbolType("Currency");
    } else if (e.target.value === "") {
      setsymbolType("SelectAnOption");
    }
  };

  const onCancel = () => {
    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        metrics: state && state.metrics ? [...state.metrics] : [],
        showTitle: state && state.showTitle !== false,
        oneMetricPerRow: state && state.oneMetricPerRow === true,
        metricTitle: (state && state.metricTitle) || "",
        datasetType: state.datasetType || undefined,
      }
    );
  };

  if (!state || !state.metrics) {
    setTimeout(onCancel, 1000);
    return null;
  }

  const crumbs = [
    {
      label: t("Dashboards"),
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: t("AddMetricScreen.AddMetric"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {loading || loadingSettings ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <div className="grid-row">
            <div className="grid-col-auto">
              <PrimaryActionBar>
                <h1 id="addMetricFormHeader" className="margin-top-0">
                  {t("AddMetricScreen.AddMetric")}
                </h1>

                <form
                  aria-labelledby="addMetricFormHeader"
                  onSubmit={handleSubmit(onSubmit)}
                  className="usa-form usa-form--large"
                  data-testid="AddMetricForm"
                >
                  <fieldset className="usa-fieldset">
                    <legend className="usa-hint grid-col-6">
                      {t("AddMetricScreen.Configure")}
                    </legend>

                    <TextField
                      id="title"
                      name="title"
                      label={t("AddMetricScreen.MetricTitle")}
                      hint={t("AddMetricScreen.MetricTitleHint")}
                      register={register}
                      error={
                        errors.title && t("AddMetricScreen.MetricTitleError")
                      }
                      required
                    />
                    <NumberField
                      id="value"
                      name="value"
                      label={t("AddMetricScreen.MetricValue")}
                      hint={t("AddMetricScreen.MetricValueHint")}
                      register={register}
                      error={
                        errors.value && t("AddMetricScreen.MetricValueError")
                      }
                      className="width-50"
                      step={0.01}
                      required
                    />

                    <Dropdown
                      id="percentage"
                      name="percentage"
                      label={t("NumberFormat")}
                      hint={t("AddMetricScreen.MetricFormatHint")}
                      options={[
                        { value: "", label: t("SelectAnOption") },
                        {
                          value: NumberDataType.Percentage,
                          label: t("Percentage"),
                        },
                        {
                          value: NumberDataType.Currency,
                          label: t("Currency"),
                        },
                      ]}
                      onChange={handlePercentage}
                      register={register}
                    />

                    {symbolType !== "Percentage" &&
                      symbolType !== "SelectAnOption" && (
                        <Dropdown
                          id="currency"
                          name="currency"
                          label={t("Currency")}
                          hint={t("AddMetricScreen.MetricCurrencyHint")}
                          options={[
                            { value: "", label: t("SelectAnOption") },
                            {
                              value: CurrencyDataType["Dollar $"],
                              label: t("Dollar"),
                            },
                            {
                              value: CurrencyDataType["Euro €"],
                              label: t("Euro"),
                            },
                            {
                              value: CurrencyDataType["Pound £"],
                              label: t("Pound"),
                            },
                          ]}
                          register={register}
                          required
                        />
                      )}
                    <TextField
                      id="changeOverTime"
                      name="changeOverTime"
                      label={t("AddMetricScreen.ChangeOverTime")}
                      hint={t("AddMetricScreen.ChangeOverTimeHint")}
                      register={register}
                      className="width-50"
                      error={
                        errors.changeOverTime &&
                        errors.changeOverTime.type === "validate"
                          ? t("AddMetricScreen.ChangeOverTimeError")
                          : undefined
                      }
                      validate={(input: string) => {
                        return !input || input[0] === "+" || input[0] === "-";
                      }}
                    />
                    <DateRangePicker
                      start={{
                        id: "startDate",
                        name: "startDate",
                        label: t("AddMetricScreen.StartDateOptional"),
                        hint: settings.dateTimeFormat.date,
                        date: startDate,
                        dateFormat: settings.dateTimeFormat.date
                          .toLowerCase()
                          .replace(/m/g, "M"),
                        setDate: setStartDate,
                      }}
                      end={{
                        id: "endDate",
                        name: "endDate",
                        label: t("AddMetricScreen.EndDateOptional"),
                        hint: settings.dateTimeFormat.date,
                        date: endDate,
                        dateFormat: settings.dateTimeFormat.date
                          .toLowerCase()
                          .replace(/m/g, "M"),
                        setDate: setEndDate,
                      }}
                    />
                  </fieldset>
                  <br />
                  <br />
                  <Button type="submit">
                    {t("AddMetricScreen.AddMetric")}
                  </Button>
                  <Button
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    variant="unstyled"
                    type="button"
                    onClick={onCancel}
                  >
                    {t("Cancel")}
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddMetric;

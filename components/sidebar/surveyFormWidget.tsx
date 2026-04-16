"use client";

import { useEffect, useState } from "react";
import { Form } from "@formio/react";
import { Formio } from "formiojs";

interface SurveyFormWidgetProps {
    surveySchema: any;
    handleSubmit: (submission: any, formioInstance?: any) => void;
}

export default function SurveyFormWidget({ surveySchema, handleSubmit }: SurveyFormWidgetProps) {
    const [formioInstance, setFormioInstance] = useState<any>(null);

    useEffect(() => {
        // @ts-expect-error — Formio types are incomplete
        Formio.icons = "fontawesome";
    }, []);

    return (
        // @ts-ignore - src is typed as required but we're passing the form schema directly
        <Form 
            form={surveySchema} 
            formReady={(formio: any) => setFormioInstance(formio)}
            onSubmit={(sub: any) => handleSubmit(sub, formioInstance)} 
            options={{
                iconset: "fontawesome"
            }} 
        />
    );
}

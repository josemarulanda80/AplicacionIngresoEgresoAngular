import { createAction,props } from "@ngrx/store";
import { IngresoEgreso } from "src/app/models/ingre-egreso.models";

export const unSetItems = createAction('[IngresoEgreso] Unset Items');

export const setItems= createAction(
    'IngresoEgreso Set Items',
    props<{items:IngresoEgreso[]}>()
)
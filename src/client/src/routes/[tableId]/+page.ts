export const ssr = false; // Disabilita SSR per questa pagina

export const load = async ({ params }) => {
	// Questo verrà eseguito solo lato client
	return {
		tableId: params.tableId
	};
};

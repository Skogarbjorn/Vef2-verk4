export async function fetchCategories() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
		);
		if (!response.ok) {
			throw new Error(`Error ${response.status}: Failed to fetch categories`);
		}
		const data = await response.json();
		return data.categories;
	} catch (err) {
		return err as Error;
	}
}

export async function fetchCategory(slug: string) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}`,
		);
		if (!response.ok) {
			throw new Error(
				`Error ${response.status}: Failed to fetch category ${slug}`,
			);
		}
		const data = await response.json();
		console.log(data);
		return data;
	} catch (err) {
		return err as Error;
	}
}

export async function fetchQuestions() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`,
		);
		if (!response.ok) {
			throw new Error(`Error ${response.status}: Failed to fetch questions`);
		}
		const data = await response.json();
		return data;
	} catch (err) {
		return err as Error;
	}
}

export async function fetchQuestionsByCategory(slug: string | undefined) {
	if (!slug) {
		throw new Error(`Error: Invalid slug`);
	}
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}/questions`,
		);
		if (!response.ok) {
			throw new Error(`Error ${response.status}: Failed to fetch questions`);
		}
		const data = await response.json();
		return data;
	} catch (err) {
		return err as Error;
	}
}

export async function fetchQuestion(id: number) {
	if (!id) {
		throw new Error(`Error: Invalid id`);
	}
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/${id}`,
		);
		if (!response.ok) {
			throw new Error(`Error ${response.status}: Failed to fetch question`);
		}
		const data = await response.json();
		return data;
	} catch (err) {
		return err as Error;
	}
}

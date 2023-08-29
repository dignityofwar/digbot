package interactor

func mapToArray[T any](m map[string]T) []T {
	s := make([]T, 0, len(m))

	for _, v := range m {
		s = append(s, v)
	}

	return s
}

func mapArray[T any, S any](s []T, m func(T) S) []S {
	a := make([]S, len(s))

	for i, v := range s {
		a[i] = m(v)
	}

	return a
}

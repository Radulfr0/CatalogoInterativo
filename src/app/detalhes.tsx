import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, Button } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Tipagem do livro básico
type Book = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string }[];
};

// Tipagem dos detalhes do livro
type BookDetails = {
  description?: string | { value: string };
  subjects?: string[];
  first_publish_date?: string;
};

const DetalhesScreen = () => {
  const params = useLocalSearchParams();
  const book: Book = params.book ? JSON.parse(params.book as string) : {};

  const [details, setDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca detalhes do livro na API pelo key
  useEffect(() => {
    async function fetchDetails() {
      if (!book.key) {
        setLoading(false);
        return;
      }
      try {
        const key = book.key.replace('/works/', '');
        const response = await fetch(`https://openlibrary.org/works/${key}.json`);
        const json = await response.json();
        setDetails(json);
      } catch (e) {
        setDetails(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [book.key]);

  const coverId = book.cover_id;
  const imageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://via.placeholder.com/200x300.png?text=No+Image';

  // Função para pegar a descrição (string ou objeto)
  function getDescription() {
    if (!details?.description) return 'Sem descrição disponível.';
    if (typeof details.description === 'string') return details.description;
    if (typeof details.description === 'object' && 'value' in details.description) return details.description.value;
    return 'Sem descrição disponível.';
  }

  // Função para voltar para a tela anterior
  function handleVoltar() {
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      {book.authors && book.authors.length > 0 && (
        <Text style={styles.author}>Por: {book.authors.map(a => a.name).join(', ')}</Text>
      )}
      <Image source={{ uri: imageUrl }} style={styles.coverImage} />
      {loading ? (
        <ActivityIndicator size="large" color="#4682B4" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.detailsText}>{getDescription()}</Text>
          {details?.first_publish_date && (
            <Text style={styles.detailsText}>Publicado em: {details.first_publish_date}</Text>
          )}
          {details?.subjects && (
            <Text style={styles.detailsText}>
              Assuntos: {details.subjects.slice(0, 5).join(', ')}
            </Text>
          )}
        </>
      )}
      <Button title="Voltar" onPress={handleVoltar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  author: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  coverImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#dfe6e9',
  },
  detailsText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default DetalhesScreen;
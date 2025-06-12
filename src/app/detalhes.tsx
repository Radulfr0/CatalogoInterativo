// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';

// // Tipagem do livro básico
// type Book = {
//   key: string;
//   title: string;
//   cover_id?: number;
//   authors?: { name: string }[];
// };

// // Tipagem dos detalhes do livro
// type BookDetails = {
//   description?: string | { value: string };
//   subjects?: string[];
//   first_publish_date?: string;
// };

// const DetalhesScreen = () => {
//   const params = useLocalSearchParams();
//   const book: Book = params.book ? JSON.parse(params.book as string) : {};

//   const [details, setDetails] = useState<BookDetails | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Busca detalhes do livro na API pelo key
//   useEffect(() => {
//     async function fetchDetails() {
//       if (!book.key) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const key = book.key.replace('/works/', '');
//         const response = await fetch(`https://openlibrary.org/works/${key}.json`);
//         const json = await response.json();
//         setDetails(json);
//       } catch (e) {
//         setDetails(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchDetails();
//   }, [book.key]);

//   const coverId = book.cover_id;
//   const imageUrl = coverId
//     ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
//     : 'https://via.placeholder.com/200x300.png?text=No+Image';

//   // Função para pegar a descrição (string ou objeto)
//   function getRawDescription() {
//     if (!details?.description) return 'Sem descrição disponível.';
//     if (typeof details.description === 'string') return details.description;
//     if (typeof details.description === 'object' && 'value' in details.description) return details.description.value;
//     return 'Sem descrição disponível.';
//   }

//   // NOVA FUNÇÃO para formatar a descrição com o nome do livro em negrito
//   function getFormattedDescription() {
//     const rawDescription = getRawDescription();
//     const bookTitle = book.title || '';

//     if (bookTitle && rawDescription.includes(bookTitle)) {
//       // Divide a descrição onde o título do livro aparece
//       const parts = rawDescription.split(bookTitle);
//       return (
//         <Text>
//           {parts[0]}
//           <Text style={{ fontWeight: 'bold' }}>{bookTitle}</Text>
//           {parts.slice(1).join(bookTitle)} {/* Junta o restante caso o título apareça mais de uma vez */}
//         </Text>
//       );
//     }
//     return <Text>{rawDescription}</Text>; // Retorna a descrição sem formatação se o título não for encontrado
//   }

//   // Função para voltar para a tela anterior
//   function handleVoltar() {
//     router.back();
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>{book.title}</Text>
//       {book.authors && book.authors.length > 0 && (
//         <Text style={styles.author}>Por: {book.authors.map(a => a.name).join(', ')}</Text>
//       )}
//       <Image source={{ uri: imageUrl }} style={styles.coverImage} />

//       {loading ? (
//         <ActivityIndicator size="large" color="#4682B4" style={{ marginTop: 20 }} />
//       ) : (
//         <>
//           <View style={styles.descriptionContainer}>
//             <Text style={styles.sectionTitle}>Sinopse</Text>
//             {/* Usando a nova função para a descrição */}
//             <Text style={styles.descriptionText}>{getFormattedDescription()}</Text>
//           </View>

//           {details?.first_publish_date && (
//             <Text style={styles.detailsText}>
//               <Text style={{ fontWeight: 'bold' }}>Publicado em:</Text> {details.first_publish_date}
//             </Text>
//           )}
//           {details?.subjects && (
//             <Text style={styles.detailsText}>
//               <Text style={{ fontWeight: 'bold' }}>Assuntos:</Text> {details.subjects.slice(0, 5).join(', ')}
//             </Text>
//           )}
//         </>
//       )}
//       <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
//         <Text style={styles.backButtonText}>Voltar</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#f0f4f8',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#2c3e50',
//     paddingHorizontal: 10,
//   },
//   author: {
//     fontSize: 18,
//     fontStyle: 'italic',
//     marginBottom: 20,
//     color: '#7f8c8d',
//     textAlign: 'center',
//   },
//   coverImage: {
//     width: 220,
//     height: 330,
//     borderRadius: 12,
//     marginBottom: 30,
//     backgroundColor: '#dfe6e9',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 8, // For Android shadow
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 10,
//     alignSelf: 'flex-start', // Alinha o título da seção à esquerda
//     paddingHorizontal: 10,
//   },
//   descriptionContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   descriptionText: {
//     fontSize: 16,
//     color: '#34495e',
//     textAlign: 'justify',
//     lineHeight: 24, // Melhora a legibilidade de textos longos
//   },
//   detailsText: {
//     fontSize: 16,
//     color: '#34495e',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   backButton: {
//     backgroundColor: '#4682B4',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     marginTop: 30,
//     marginBottom: 20, // Garante espaço na parte inferior
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   backButtonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default DetalhesScreen;
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { Ionicons } from '@expo/vector-icons'; // Importar ícones (se você já usa Expo, já deve ter)

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

const FAVORITES_KEY = '@MyApp:favorites'; // Chave para AsyncStorage

const DetalhesScreen = () => {
  const params = useLocalSearchParams();
  const book: Book = params.book ? JSON.parse(params.book as string) : {};

  const [details, setDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // Novo estado para favorito

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
        Alert.alert("Erro", "Não foi possível carregar os detalhes do livro.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [book.key]);

  // Carrega o status de favorito do AsyncStorage ao montar o componente
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favorites) {
          const parsedFavorites: Book[] = JSON.parse(favorites);
          const found = parsedFavorites.some(favBook => favBook.key === book.key);
          setIsFavorite(found);
        }
      } catch (error) {
        console.error("Erro ao verificar favoritos:", error);
      }
    };
    checkFavoriteStatus();
  }, [book.key]);

  const coverId = book.cover_id;
  const imageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://via.placeholder.com/200x300.png?text=No+Image';

  // Função para pegar a descrição (string ou objeto)
  function getRawDescription() {
    if (!details?.description) return 'Sem descrição disponível.';
    if (typeof details.description === 'string') return details.description;
    if (typeof details.description === 'object' && 'value' in details.description) return details.description.value;
    return 'Sem descrição disponível.';
  }

  // Função para formatar a descrição com o nome do livro em negrito
  function getFormattedDescription() {
    const rawDescription = getRawDescription();
    const bookTitle = book.title || '';

    // Verifica se o título do livro (ignorando maiúsculas/minúsculas) está na descrição
    const lowerRawDescription = rawDescription.toLowerCase();
    const lowerBookTitle = bookTitle.toLowerCase();

    if (bookTitle && lowerRawDescription.includes(lowerBookTitle)) {
      const parts = rawDescription.split(new RegExp(bookTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')); // Regex para ignorar case e caracteres especiais
      const renderedParts = [];
      for (let i = 0; i < parts.length; i++) {
        renderedParts.push(<Text key={`part-${i}`}>{parts[i]}</Text>);
        if (i < parts.length - 1) {
          renderedParts.push(<Text key={`title-${i}`} style={{ fontWeight: 'bold' }}>{bookTitle}</Text>);
        }
      }
      return <Text>{renderedParts}</Text>;
    }
    return <Text>{rawDescription}</Text>;
  }

  // Função para adicionar/remover dos favoritos
  const toggleFavorite = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let parsedFavorites: Book[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Remover dos favoritos
        parsedFavorites = parsedFavorites.filter(favBook => favBook.key !== book.key);
        setIsFavorite(false);
        Alert.alert("Sucesso", "Livro removido dos favoritos!");
      } else {
        // Adicionar aos favoritos
        parsedFavorites.push(book);
        setIsFavorite(true);
        Alert.alert("Sucesso", "Livro adicionado aos favoritos!");
      }
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(parsedFavorites));
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
    }
  }, [isFavorite, book]);


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
          <View style={styles.favoriteButtonContainer}>
             {/* Botão de Favoritar */}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'} // Ícone de coração preenchido ou contorno
                size={30}
                color={isFavorite ? '#e74c3c' : '#7f8c8d'} // Cor vermelha para favorito, cinza para não favorito
              />
              <Text style={styles.favoriteButtonText}>
                {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Sinopse</Text>
            <Text style={styles.descriptionText}>{getFormattedDescription()}</Text>
          </View>

          {details?.first_publish_date && (
            <Text style={styles.detailsText}>
              <Text style={{ fontWeight: 'bold' }}>Publicado em:</Text> {details.first_publish_date}
            </Text>
          )}
          {details?.subjects && (
            <Text style={styles.detailsText}>
              <Text style={{ fontWeight: 'bold' }}>Assuntos:</Text> {details.subjects.slice(0, 5).join(', ')}
            </Text>
          )}
        </>
      )}
      <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1E3A8A',
    paddingHorizontal: 10,
  },
  author: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#93C5FD',
    textAlign: 'center',
  },
  coverImage: {
    width: 220,
    height: 330,
    borderRadius: 12,
    marginBottom: 30,
    backgroundColor: '#dfe6e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8, // For Android shadow
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A1F33',
    marginBottom: 10,
    alignSelf: 'flex-start', // Alinha o título da seção à esquerda
    paddingHorizontal: 10,
  },
  descriptionContainer: {
    color: '#3B82F6',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'justify',
    lineHeight: 24, // Melhora a legibilidade de textos longos
  },
  detailsText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  // Estilos para o botão de favoritar
  favoriteButtonContainer: {
    width: '100%',
    alignItems: 'flex-end', // Alinha o botão à direita
    marginBottom: 15,
    paddingRight: 10, // Adiciona um pequeno padding à direita
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  favoriteButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0A1F33',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 20, // Garante espaço na parte inferior
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    color: '#0A1F33',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetalhesScreen;